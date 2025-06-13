import { toast } from 'react-toastify';

class CategoryService {
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
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "color" } },
          { "Field": { "Name": "icon" } },
          { "Field": { "Name": "task_count" } },
          { "Field": { "Name": "order" } },
          { "Field": { "Name": "CreatedOn" } },
          { "Field": { "Name": "ModifiedOn" } }
        ],
        "orderBy": [
          {
            "FieldName": "order",
            "SortType": "ASC"
          }
        ],
        "PagingInfo": {
          "Limit": 100,
          "Offset": 0
        }
      };
      
      const response = await apperClient.fetchRecords('category', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return (response.data || []).map(cat => this.mapDbToFrontend(cat));
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: ["Id", "Name", "color", "icon", "task_count", "order", "CreatedOn", "ModifiedOn"]
      };
      
      const response = await apperClient.getRecordById('category', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Category not found');
      }
      
      return this.mapDbToFrontend(response.data);
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw new Error('Category not found');
    }
  }

  async create(categoryData) {
    try {
      const apperClient = this.getApperClient();
      
      // Map frontend fields to database fields and only include updateable fields
      const dbRecord = {
        Name: categoryData.name || '',
        color: categoryData.color || '#5B21B6',
        icon: categoryData.icon || 'Tag',
        task_count: 0,
        order: categoryData.order || 0
      };
      
      const params = {
        records: [dbRecord]
      };
      
      const response = await apperClient.createRecord('category', params);
      
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
            throw new Error('Failed to create category');
          }
        }
        
        if (successfulRecords.length > 0) {
          return this.mapDbToFrontend(successfulRecords[0].data);
        }
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating category:", error);
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
      
      if (updates.name !== undefined) dbUpdates.Name = updates.name;
      if (updates.color !== undefined) dbUpdates.color = updates.color;
      if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
      if (updates.taskCount !== undefined) dbUpdates.task_count = updates.taskCount;
      if (updates.order !== undefined) dbUpdates.order = updates.order;
      
      const params = {
        records: [dbUpdates]
      };
      
      const response = await apperClient.updateRecord('category', params);
      
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
            throw new Error('Failed to update category');
          }
        }
        
        if (successfulUpdates.length > 0) {
          return this.mapDbToFrontend(successfulUpdates[0].data);
        }
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('category', params);
      
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
            throw new Error('Failed to delete category');
          }
        }
        
        return { success: true };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }

  async updateTaskCount(id, count) {
    try {
      return await this.update(id, { taskCount: count });
    } catch (error) {
      console.error("Error updating task count:", error);
      throw error;
    }
  }

  // Helper method to map database fields to frontend format
  mapDbToFrontend(dbRecord) {
    return {
      id: dbRecord.Id?.toString() || dbRecord.id?.toString(),
      name: dbRecord.Name || '',
      color: dbRecord.color || '#5B21B6',
      icon: dbRecord.icon || 'Tag',
      taskCount: dbRecord.task_count || 0,
      order: dbRecord.order || 0
    };
  }
}

export default new CategoryService();