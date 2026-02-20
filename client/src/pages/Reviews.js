import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Reviews = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewee, setReviewee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
    fetchUser();
  }, [userId]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/reviews/user/${userId}`);
      setReviews(res.data.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`/api/users/${userId}`);
      setReviewee(res.data.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const renderStars = (rating) => (
    <span>
      <span className="text-yellow-400">{'★'.repeat(rating)}</span>
      <span className="text-gray-300">{'★'.repeat(5 - rating)}</span>
    </span>
  );

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
      <div className="spinner" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link to={`/profile/${userId}`} className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium mb-6 hover:underline">
          ← Back to Profile
        </Link>

        {/* Reviewee Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              {reviewee?.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{reviewee?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {renderStars(Math.round(reviewee?.rating || 0))}
                <span className="text-sm text-gray-500">{reviewee?.rating?.toFixed(1) || '0.0'} / 5</span>
                <span className="text-sm text-gray-400">({reviewee?.totalReviews || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews & Ratings</h2>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="text-5xl mb-3">⭐</div>
            <h3 className="font-semibold text-gray-700 mb-1">No reviews yet</h3>
            <p className="text-gray-400 text-sm">This freelancer hasn't received any reviews yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                      {review.reviewer?.name?.charAt(0)}
                    </div>
                    <div>
                      <Link to={`/profile/${review.reviewer?._id}`} className="font-semibold text-gray-900 text-sm hover:text-indigo-600 transition">
                        {review.reviewer?.name}
                      </Link>
                      <div className="text-sm">{renderStars(review.rating)}</div>
                    </div>
                  </div>
                  <Link to={`/contracts/${review.contract?._id}`} className="text-xs text-indigo-600 font-medium hover:underline max-w-[150px] text-right truncate">
                    {review.contract?.title}
                  </Link>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.feedback}</p>
                <div className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
