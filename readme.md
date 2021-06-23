# Substrate funding service

## Installing and running

create `.env` file with following content:

```
URL=wss://substrate01.threefold.io
MNEMONIC=substrate ed25519 private words
```

Run backend

```
yarn
node bin/www
```

## Post to localhost:3000/activate

bash
```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"kycSignature": "test", "data": {"name": "name"}, "substrateAccountID": "some_id"}' \
  http://localhost:3000/activate
```