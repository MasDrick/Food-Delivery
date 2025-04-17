import React from 'react';
import s from './SkeletonLoader.module.scss';

const RestaurantPageSkeleton = () => {
  return (
    <div className={s.restaurantPageSkeleton}>
      {/* Hero Section Skeleton */}
      <div className={s.heroSectionSkeleton}>
        <div className={s.heroImageSkeleton}></div>
        <div className={s.heroContentSkeleton}>
          <div className={s.restaurantTitleSkeleton}></div>
        </div>
        <div className={s.restaurantInfoSkeleton}>
          <div className={s.infoItemSkeleton}></div>
          <div className={s.infoItemSkeleton}></div>
          <div className={s.infoItemSkeleton}></div>
        </div>
      </div>

      {/* Menu Section Skeleton */}
      <div className={s.menuSectionSkeleton}>
        <div className={s.menuTitleSkeleton}></div>
        
        <div className={s.menuGridSkeleton}>
          {/* Generate 8 menu item skeletons */}
          {Array(6).fill().map((_, index) => (
            <div key={index} className={s.menuItemSkeleton}>
              <div className={s.itemNameSkeleton}></div>
              <div className={s.itemDetailsSkeleton}>
                <div className={s.itemWeightSkeleton}></div>
                <div className={s.itemPriceSkeleton}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPageSkeleton;