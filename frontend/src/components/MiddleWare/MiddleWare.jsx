
export const localStorageMiddleware = ({ getState }) => (next) => (action) => {
    const result = next(action)
    localStorage.setItem('userData', JSON.stringify(getState()));
    return result
};