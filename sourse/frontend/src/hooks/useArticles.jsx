import { useState, useEffect } from 'react';
import api from '../api/axios';

export function useArticles(filters = {}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: filters.limit || 10,
    total: 0
  });

  const fetchArticles = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        skip: ((params.page || pagination.page) - 1) * pagination.limit,
        limit: pagination.limit,
        status: params.status || 'published',
        ...filters,
        ...params
      }).toString();
      
      const response = await api.get(`/articles?${queryParams}`);
      
      setArticles(response.data);
      // Если бэкенд возвращает общую информацию о количестве
      if (response.headers['x-total-count']) {
        setPagination(prev => ({
          ...prev,
          total: parseInt(response.headers['x-total-count'], 10)
        }));
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getArticleBySlug = async (slug) => {
    try {
      const response = await api.get(`/articles/${slug}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching article:', err);
      throw err;
    }
  };

  const createArticle = async (articleData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/articles', articleData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error creating article:', err);
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Ошибка создания статьи' 
      };
    }
  };

  const updateArticle = async (id, articleData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.patch(`/articles/${id}`, articleData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error updating article:', err);
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Ошибка обновления статьи' 
      };
    }
  };

  const deleteArticle = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(articles.filter(a => a.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting article:', err);
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Ошибка удаления статьи' 
      };
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [filters.status, filters.author_id]);

  return {
    articles,
    loading,
    error,
    pagination,
    getArticleBySlug,
    createArticle,
    updateArticle,
    deleteArticle,
    refetch: fetchArticles
  };
}

export default useArticles;