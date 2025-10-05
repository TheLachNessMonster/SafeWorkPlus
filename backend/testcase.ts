import { NewApiClient } from "./api/newapi";
const client = new NewApiClient("http://localhost:3000");

async function main(){
    await client.login("ashley@safework.com", "abc123");
}

main();