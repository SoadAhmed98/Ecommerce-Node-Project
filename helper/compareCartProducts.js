export default function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    
    const sortedArr1 = arr1.slice().sort((a, b) => {
        const productIdA = String(a.productId); // Convert productId to string
        const productIdB = String(b.productId); // Convert productId to string
        return productIdA.localeCompare(productIdB);
    });
    const sortedArr2 = arr2.slice().sort((a, b) => {
        const productIdA = String(a.productId); // Convert productId to string
        const productIdB = String(b.productId); // Convert productId to string
        return productIdA.localeCompare(productIdB);
    });

    for (let i = 0; i < sortedArr1.length; i++) {
        const obj1 = sortedArr1[i];
        const obj2 = sortedArr2[i];
        if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
            return false;
        }
    }

    return true;
}
