import { createNavigationContainerRef, StackActions, CommonActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigate(name, params)
{
    if (navigationRef.isReady())
    {
        navigationRef.navigate(name, params);
    }
}

export function goBack()
{
    if (navigationRef.isReady())
    {
        navigationRef.goBack();
    }
}

export function replace(name, params)
{
    if (navigationRef.isReady())
    {
        navigationRef.dispatch(
            StackActions.replace(name, params),
        );
    }
}

export function removeRouteFromStack(name)
{
    if (navigationRef.isReady())
    {
        navigationRef.dispatch(state =>
        {

            const routes = state.routes.filter(r => r.name !== name);

            return CommonActions.reset({
                ...state,
                routes,
                index: routes.length - 1,
            });
        });
    }
}
