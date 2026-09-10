import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { Review, User } from "../types";
import StarRating from "../components/StarRating";

export default function Ratings() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profileUser, setProfileUser] = useState<User | null>(null);

  useEffect(() => {
    if (!userId) return;
    api.get(`/reviews/${userId}`).then(({ data }) => setReviews(data.reviews));
    api.get(`/users/${userId}`).then(({ data }) => setProfileUser(data.user));
  }, [userId]);

  return (
    <div className="pb-16 px-5 pt-5">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="font-bold text-lg">Sharhlar</span>
      </div>

      {profileUser && (
        <div className="flex items-center gap-2 mb-5">
          <StarRating rating={profileUser.rating} />
          <span className="text-dim text-sm">{profileUser.rating} ({profileUser.reviewsCount} ta sharh)</span>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center text-dim py-16">Hali sharhlar yo'q</div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <div key={r._id} className="bg-card border border-border rounded-xl p-3.5">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-full bg-elevated flex items-center justify-center overflow-hidden flex-shrink-0">
                  {r.fromUser.avatar ? <img src={r.fromUser.avatar} className="w-full h-full object-cover" /> : "👤"}
                </div>
                <div>
                  <div className="text-sm font-semibold">{r.fromUser.firstName}</div>
                  <StarRating rating={r.rating} size={11} />
                </div>
              </div>
              <p className="text-dim text-sm">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
