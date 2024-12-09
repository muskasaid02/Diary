// frontend/frontend_tests/setup.js
import '@testing-library/jest-dom';
import React from 'react';

global.React = React;

global.fetch = jest.fn();

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;