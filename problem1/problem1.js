//Iterative approach
var sum_to_n_a = function(n) {
    let total = 0;
    for (let i = 1; i <= n; i++) {
        total += i;
    }
    return total;
};

//Summation formula
var sum_to_n_b = function(n) {
    return (n * (n + 1)) / 2;
};

//Recursive approach
var sum_to_n_c = function(n) {
    if (n <= 1) {
        return n;
    } else {
        return n + sum_to_n_c(n - 1);
    }
};
