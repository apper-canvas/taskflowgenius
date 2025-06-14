import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    // Initialize ApperClient
    this.getApperClient = () => {
      const { ApperClient } = window.ApperSDK;
      return new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    };
  }

  async getAll() {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "title" } },
          { "Field": { "Name": "description" } },
          { "Field": { "Name": "category_id" } },
          { "Field": { "Name": "priority" } },
          { "Field": { "Name": "due_date" } },
          { "Field": { "Name": "completed" } },
          { "Field": { "Name": "completed_at" } },
          { "Field": { "Name": "archived" } },
          { "Field": { "Name": "created_at" } },
          { "Field": { "Name": "CreatedOn" } },
          { "Field": { "Name": "ModifiedOn" } }
        ],
        "PagingInfo": {
          "Limit": 100,
          "Offset": 0
        }
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: ["Id", "title", "description", "category_id", "priority", "due_date", "completed", "completed_at", "archived", "created_at", "CreatedOn", "ModifiedOn"]
      };
      
      const response = await apperClient.getRecordById('task', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Task not found');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw new Error('Task not found');
    }
  }

  async create(taskData) {
    try {
      const apperClient = this.getApperClient();
      
      // Map frontend fields to database fields and only include updateable fields
      const dbRecord = {
        title: taskData.title || '',
        description: taskData.description || '',
        category_id: parseInt(taskData.categoryId) || null,
        priority: taskData.priority || 'medium',
        due_date: taskData.dueDate || new Date().toISOString(),
        completed: taskData.completed || false,
        completed_at: taskData.completedAt || null,
        archived: taskData.archived || false,
        created_at: new Date().toISOString()
      };
      
      const params = {
        records: [dbRecord]
      };
      
      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          
          if (successfulRecords.length === 0) {
            throw new Error('Failed to create task');
          }
        }
        
        if (successfulRecords.length > 0) {
          return this.mapDbToFrontend(successfulRecords[0].data);
        }
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const apperClient = this.getApperClient();
      
      // Map frontend fields to database fields and only include updateable fields
      const dbUpdates = {
        Id: parseInt(id)
      };
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.categoryId !== undefined) dbUpdates.category_id = parseInt(updates.categoryId) || null;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
      if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
      if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;
      if (updates.archived !== undefined) dbUpdates.archived = updates.archived;
      
      const params = {
        records: [dbUpdates]
      };
      
      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          
          if (successfulUpdates.length === 0) {
            throw new Error('Failed to update task');
          }
        }
        
        if (successfulUpdates.length > 0) {
          return this.mapDbToFrontend(successfulUpdates[0].data);
        }
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          
          if (successfulDeletions.length === 0) {
            throw new Error('Failed to delete task');
          }
        }
        
        return { success: true };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  async getByCategory(categoryId) {
    try {
      const allTasks = await this.getAll();
      return allTasks.filter(t => t.categoryId === categoryId.toString());
    } catch (error) {
      console.error("Error fetching tasks by category:", error);
      return [];
    }
  }

  async getCompleted() {
    try {
      const allTasks = await this.getAll();
      return allTasks.filter(t => t.completed && !t.archived);
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
      return [];
    }
  }

  async getArchived() {
    try {
      const allTasks = await this.getAll();
      return allTasks.filter(t => t.archived);
    } catch (error) {
      console.error("Error fetching archived tasks:", error);
      return [];
    }
  }

  // Helper method to map database fields to frontend format
  mapDbToFrontend(dbRecord) {
    return {
      id: dbRecord.Id?.toString() || dbRecord.id?.toString(),
      title: dbRecord.title || '',
      description: dbRecord.description || '',
      categoryId: dbRecord.category_id?.toString() || null,
      priority: dbRecord.priority || 'medium',
      dueDate: dbRecord.due_date || null,
      completed: dbRecord.completed || false,
      completedAt: dbRecord.completed_at || null,
      archived: dbRecord.archived || false,
      createdAt: dbRecord.created_at || dbRecord.CreatedOn || new Date().toISOString()
    };
  }
}
export default new TaskService();