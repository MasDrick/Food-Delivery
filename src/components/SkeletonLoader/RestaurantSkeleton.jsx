import React from 'react';
import s from './SkeletonLoader.module.scss';

const RestaurantSkeleton = () => {
  return (
    <div className={s.skeletonCard}>
      <div className={s.skeletonImage}></div>
      <div className={s.skeletonContent}>
        <div className={s.skeletonTitle}></div>
        <div className={s.skeletonInfo}>
          <div className={s.skeletonBadge}></div>
          <div className={s.skeletonBadge}></div>
          <div className={s.skeletonBadge}></div>
        </div>
        <div className={s.skeletonText}></div>
      </div>
    </div>
  );
};

export default RestaurantSkeleton;