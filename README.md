This is used for matching data and searching closest ones that match with Orders

## Getting Started

For Local:

```bash
npm install
```

Environment setup:

copy `.env.example` file and rename it to `.env`. set the `PORT` & `DB_URL` based on you'r settings

Example:

```
PORT=8000
DB_URL=mongodb://localhost:27017/
```

Sart the project: 

```bash
npm start
```

## Learn More about funcations

Main url is [`/match`](https://github.com/techtricks-mas/matching/blob/960817aef7a1542f46304592cf3875c0a7024001/src/routes/index.js#L22C22-L97C1) which is matching the requested data.

At [`first`](https://github.com/techtricks-mas/matching/blob/960817aef7a1542f46304592cf3875c0a7024001/src/routes/index.js#L29) we are searching requsted data in our database to find if used same orders data before by [`findApprovedMatch`](https://github.com/techtricks-mas/matching/blob/960817aef7a1542f46304592cf3875c0a7024001/src/helper/findApproveMatch.js#L3) function.

If we have old approved data, we check with closest data from previous search which can give us accurate closest data. At first we go throw each of the transactions and check each `orderId`, `customerName`, `product` by [`isLikelyMatchStrings`](https://github.com/techtricks-mas/matching/blob/960817aef7a1542f46304592cf3875c0a7024001/src/helper/likeMatch.js#L19-L21) this will check closest strings with old and requested data. and by checking them we which met the conditions and sent them in response. [`ApproveMatch code`](https://github.com/techtricks-mas/matching/blob/960817aef7a1542f46304592cf3875c0a7024001/src/routes/index.js#L31-L50)


If we don't have any old data, we go for full matching codes where we check `orderId`, `customerName`, `product`, `price`, `date` by [`isLikelyMatch`](https://github.com/techtricks-mas/matching/blob/960817aef7a1542f46304592cf3875c0a7024001/src/helper/likeMatch.js#L4-L18). This check all strings and give us some point result by closest to not matched values like `10 - 20` points per transaction. Then we Sort them and arrange them in ASC order. After this we filter them with a condition to find closest match point which we set to `13`. By this condition we get bestMatches transections per Orders and insert them into databases for future matching cycles. This way we can learn and find closest data more accuretly in future. [`Full Matching`](https://github.com/techtricks-mas/matching/blob/960817aef7a1542f46304592cf3875c0a7024001/src/routes/index.js#L52-L90)

Inserted data need to approved by users by url [`/status/:id`](https://github.com/techtricks-mas/matching/blob/960817aef7a1542f46304592cf3875c0a7024001/src/routes/index.js#L98-L119) so that we know these are correct or not. if correct user submit it to Approved to use in fuure.

## External Package & Functions

This project uses the [`js-levenshtein`](https://github.com/gustf/js-levenshtein) package, which implements the Levenshtein distance algorithm for comparing strings. The Levenshtein distance measures the number of changes (insertions, deletions, or substitutions) required to turn one string into another. This is especially useful for matching strings that may have small variations, such as names, IDs, or product descriptions.

By leveraging this algorithm, we can calculate how similar two strings are and find the closest matches between an order and a list of transactions.

### Function: `normalizeString`

The `normalizeString` function is used to prepare strings for comparison by converting them to lowercase and removing any non-alphanumeric characters. This ensures a fair comparison, ignoring case and irrelevant symbols.

```javascript
const normalizeString = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
```



