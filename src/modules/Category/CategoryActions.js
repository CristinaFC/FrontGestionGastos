import { } from './Types'
import Types from './Types'

import { getCategories, putCategoryById, getCategoryById, postCategory, deleteCategory, getCategoriesByType } from '../../services/api/API';
import * as RootRouting from '../../navigation/RootRouting'
import Routing from '../../navigation/Routing';

export const apiGetCategories = () => async (dispatch, getState) =>
{
    dispatch(setCategoryDataState({ prop: 'isLoadingCategories', value: true }));
    await dispatch(
        getCategories((tag, response) =>
        {
            console.log('getCategories - ERROR: ', response);
            dispatch({ type: Types.GET_CATEGORIES_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getCategories - SUCCESS: ', response);
            dispatch({
                type: Types.GET_CATEGORIES_SUCCESS,
                payload: response.data.categories,
            });
        }))

    dispatch(setCategoryDataState({ prop: 'isLoadingCategories', value: false }))

};

export const apiGetCategoriesByType = (type) => async (dispatch, getState) =>
{
    dispatch(setCategoryDataState({ prop: 'isLoadingCategories', value: true }));
    await dispatch(
        getCategoriesByType(type, (tag, response) =>
        {
            console.log('getCategories - ERROR: ', response);
            dispatch({ type: Types.GET_CATEGORIES_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getCategories - SUCCESS: ', response);
            dispatch({
                type: Types.GET_CATEGORIES_SUCCESS,
                payload: response.data.categories,
            });
        }))

    dispatch(setCategoryDataState({ prop: 'isLoadingCategories', value: false }))

};


export const apiGetCategoryById = (id) => async (dispatch, getState) =>
{

    dispatch(setCategoryDataState({ prop: 'isLoadingCategory', value: true }));
    await dispatch(
        getCategoryById(id, (tag, response) =>
        {
            console.log('getCategoryById - ERROR: ', response);
            dispatch({ type: Types.GET_CATEGORY_DETAILS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getCategoryById - SUCCESS: ', response);
            dispatch({
                type: Types.GET_CATEGORY_DETAILS_SUCCESS,
                payload: response.data.category,
            });
        }))

    dispatch(setCategoryDataState({ prop: 'isLoadingCategory', value: false }))

};

export const apiPutCategoryById = (id, params) => async (dispatch, getState) =>
{

    dispatch(setCategoryDataState({ prop: 'isLoadingCategory', value: true }));
    await dispatch(
        putCategoryById(id, params, (tag, response) =>
        {
            console.log('updateCategoryById - ERROR: ', response);
            dispatch({ type: Types.PUT_DATA_CATEGORY_FAIL, payload: response });
        }, (tag, response) =>
        {
            console.log('updateCategoryById - SUCCESS: ', response);
            dispatch({
                type: Types.PUT_DATA_CATEGORY_SUCCESS,
                payload: response.data.category,
            });
        }))
    RootRouting.navigate(Routing.categories)
    dispatch(apiGetCategories())
    dispatch(setCategoryDataState({ prop: 'isLoadingCategory', value: false }));

};

export const apiPostCategory = (params) => async (dispatch, getState) =>
{
    dispatch(setCategoryDataState({ prop: 'isLoadingCategory', value: true }));
    await dispatch(
        postCategory(params, (tag, response) =>
        {
            console.log('postCategory - ERROR: ', response);
            dispatch({ type: Types.POST_CATEGORY_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('postCategory - SUCCESS: ', response);
            dispatch({ type: Types.POST_CATEGORY_SUCCESS, payload: response });
            RootRouting.navigate(Routing.categories)
            dispatch(apiGetCategories())

        })
    );
    dispatch(setCategoryDataState({ prop: 'isLoadingCategory', value: false }));
};

export const apiDeleteCategory = (id) => async (dispatch, getState) =>
{

    await dispatch(
        deleteCategory(id, (tag, response) =>
        {
            console.log('deleteCategory - ERROR: ', response);
            dispatch({ type: Types.DELETE_CATEGORY_FAIL, payload: response });
        }, (tag, response) =>
        {
            console.log('deleteCategory - SUCCESS: ', response);
            dispatch({ type: Types.DELETE_CATEGORY_SUCCESS, payload: response });


        })
    );
    RootRouting.navigate(Routing.categories)
    dispatch(apiGetCategories())

};

export const clearCategoriesData = () => ({
    type: Types.CLEAR_DATA_CATEGORY,
});

export const setCategoryDataState = ({ prop, value }) => ({
    type: Types.PUT_DATA_CATEGORY,
    payload: { prop, value },
});
