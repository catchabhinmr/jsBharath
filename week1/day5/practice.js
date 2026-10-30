//fails all if one fails
const [a,b] = await Promise.all([fetch(user1),fetch(user2)]);
//waits for all and reports each results separately
const result = await Promise.allSettled([fetch(user1),fetch(user2)])