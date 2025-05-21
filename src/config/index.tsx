const PROJECT_NAME = 'dinehub';
const PROJECT = 'bursopuri'
const URL_HELP = `https://george-fx.github.io/APIs/${PROJECT_NAME}`;
const MAIN_URL = `https://back-bursopuri.vercel.app/${PROJECT}`;

const GET_MENU = `${MAIN_URL}/categories`;
const GET_DISHES = `${MAIN_URL}/menus`;
const GET_ORDERS = `${MAIN_URL}/order-history`;
const GET_REVIEWS = `${URL_HELP}/api/reviews.json`;
const GET_CAROUSEL = `${MAIN_URL}/carousel`;
const GET_ONBOARDING = `${MAIN_URL}/onboarding`;
const GET_PROMOCODES = `${URL_HELP}/api/promocodes.json`;
const GET_NOTIFICATIONS = `${URL_HELP}/api/notifications.json`;

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
