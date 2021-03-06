/* @flow */
import {
  FETCH_REVIEWS, SET_ADDON_REVIEWS, SET_REVIEW,
} from 'amo/constants';
import type { ApiReviewType } from 'amo/api/reviews';

export type UserReviewType = {|
  addonId: number,
  addonSlug: string,
  body?: string,
  created: Date,
  id: number,
  isLatest: boolean,
  rating: number,
  title: string,
  userId: number,
  userName: string,
  userUrl: string,
  versionId: ?number,
|};

export function denormalizeReview(review: ApiReviewType): UserReviewType {
  return {
    addonId: review.addon.id,
    addonSlug: review.addon.slug,
    body: review.body,
    created: review.created,
    id: review.id,
    isLatest: review.is_latest,
    rating: review.rating,
    title: review.title,
    userId: review.user.id,
    userName: review.user.name,
    userUrl: review.user.url,
    // TODO: Figure out why version could be null and/or plan for it.
    versionId: review.version && review.version.id,
  };
}

export type SetReviewAction = {|
  type: string,
  payload: UserReviewType,
|};

export const setReview = (review: ApiReviewType): SetReviewAction => {
  if (!review) {
    throw new Error('review cannot be empty');
  }
  return { type: SET_REVIEW, payload: denormalizeReview(review) };
};

type FetchReviewsParams = {|
  addonSlug: string,
  errorHandlerId: string,
  page?: number,
|};

export type FetchReviewsAction = {|
  type: string,
  payload: {|
    addonSlug: string,
    errorHandlerId: string,
    page: number,
  |},
|};

export function fetchReviews(
  { addonSlug, errorHandlerId, page = 1 }: FetchReviewsParams
): FetchReviewsAction {
  if (!errorHandlerId) {
    throw new Error('errorHandlerId cannot be empty');
  }
  if (!addonSlug) {
    throw new Error('addonSlug cannot be empty');
  }
  return {
    type: FETCH_REVIEWS,
    payload: { addonSlug, errorHandlerId, page },
  };
}

export const setDenormalizedReview = (
  review: UserReviewType
): SetReviewAction => {
  if (!review) {
    throw new Error('review cannot be empty');
  }
  return { type: SET_REVIEW, payload: review };
};

export type SetAddonReviewsAction = {|
  type: string,
  payload: {|
    addonSlug: string,
    reviewCount: number,
    reviews: Array<UserReviewType>,
  |},
|};

type SetAddonReviewsParams = {|
  addonSlug: string,
  reviewCount: number,
  reviews: Array<ApiReviewType>,
|};

export const setAddonReviews = (
  { addonSlug, reviewCount, reviews }: SetAddonReviewsParams
): SetAddonReviewsAction => {
  if (!addonSlug) {
    throw new Error('addonSlug cannot be empty');
  }
  if (!Array.isArray(reviews)) {
    throw new Error('reviews must be an Array');
  }
  if (typeof reviewCount === 'undefined') {
    throw new Error('reviewCount must be set');
  }
  return {
    type: SET_ADDON_REVIEWS,
    payload: {
      addonSlug,
      reviewCount,
      reviews: reviews.map((review) => denormalizeReview(review)),
    },
  };
};
