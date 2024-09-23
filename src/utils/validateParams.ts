export const validateParams = (origin: string | undefined, destination: string | undefined): string | null => {
    const isValid = (code: string) => /^[A-Z]{3}$/.test(code);

    if (!origin || !destination) {
        return 'Origin and destination must be provided.';
    }
    if (!isValid(origin)) {
        return 'Invalid origin. It must be a 3-letter airport code.';
    }
    if (!isValid(destination)) {
        return 'Invalid destination. It must be a 3-letter airport code.';
    }
    return null;
};
