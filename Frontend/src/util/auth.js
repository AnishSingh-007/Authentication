import { redirect } from 'react-router-dom';

export function getTokenDuration() {
    const storedExpirationDate = localStorage.getItem('expiration');
    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    // getTime() is used to convert the time in milliseconds
    // .toISOString() method returns a date object as a string,
    //  toLocaleString() method returns a Date object as a string (5 Dec 2023), using locale settings

    const duration = expirationDate.getTime() - now.getTime();
    return duration;
}

export function getAuthToken() {
    const token = localStorage.getItem('token');

    if (!token) {
        return null;
    };
    
    const tokenDuration = getTokenDuration();
    if (tokenDuration < 0) {
        return 'EXPIRED';
    }

    return token;
}

export function tokenLoader() {
    return getAuthToken();
}

export function checkAuthLoader() {
    const token = getAuthToken();
    
    if (!token) {
      return redirect('/auth?mode=login');
    }
    return null; 
  }