declare global {
    namespace jest {
        interface Matchers<R> {
            toBeValid(): R;
        }
    }
}

export {};
