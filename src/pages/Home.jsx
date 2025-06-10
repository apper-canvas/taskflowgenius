import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Today view as the default landing
    navigate('/today', { replace: true });
  }, [navigate]);

  return null;
};

export default Home;