module.exports = {
    // negative modulos in Javascript is pretty confusing
    // when we have to deal with something like -1 mod 48
    fixedModulo : (a, n) => ((a % n) + n) % n,
    roundTwo : n => {
        let d = 100;
        return Math.round (n * d) / d;
    }
};