import type { DefaultRequestMultipartBody, MockedRequest, RestHandler } from 'msw';
import { rest } from 'msw';
import searchCatalogItemsResponse from './fixtures/square/search-catalog-items.json';
import getImagesResponse from './fixtures/square/get-images.json';

const baseUrl = 'https://connect.squareup.com/v2';

export const squareHandlers = [
  rest.post(`${baseUrl}/catalog/search-catalog-items`, (req, res, context) => {
    return res(context.json(searchCatalogItemsResponse));
  }),

  rest.get(`${baseUrl}/catalog/list?types=image`, (req, res, context) => {
    return res(context.json(getImagesResponse));
  }),
] satisfies RestHandler<MockedRequest<DefaultRequestMultipartBody>>[];
