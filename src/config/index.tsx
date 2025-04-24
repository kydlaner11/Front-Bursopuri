const PROJECT_NAME = 'dinehub';
const PROJECT = 'bursopuri'
const MAIN_URL = `https://george-fx.github.io/APIs/${PROJECT_NAME}`;
const MAIN_URL_LOCAL = `http://localhost:3002/${PROJECT}`;

const GET_MENU = `${MAIN_URL_LOCAL}/categories`;
const GET_DISHES = `${MAIN_URL_LOCAL}/menus`;
const GET_ORDERS = `${MAIN_URL}/api/orders.json`;
const GET_REVIEWS = `${MAIN_URL}/api/reviews.json`;
const GET_CAROUSEL = `${MAIN_URL_LOCAL}/carousel`;
const GET_ONBOARDING = `${MAIN_URL_LOCAL}/onboarding`;
const GET_PROMOCODES = `${MAIN_URL}/api/promocodes.json`;
const GET_NOTIFICATIONS = `${MAIN_URL}/api/notifications.json`;

export const URLS = {
  MAIN_URL,
  GET_MENU,
  GET_DISHES,
  GET_ORDERS,
  GET_REVIEWS,
  GET_CAROUSEL,
  GET_PROMOCODES,
  GET_ONBOARDING,
  GET_NOTIFICATIONS,
};
