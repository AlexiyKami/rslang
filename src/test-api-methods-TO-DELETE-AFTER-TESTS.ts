/*
Copy import and const a to index.ts + method for testing.
See results in console

Test User
{
  "email": "test1@testmail.con",
  "password": "password",
  "userId": "62f90aa40ebed300162e203d",
}

Run userSignIn to get tokens
*/

// (async () => {
//   console.log(await a.userSignIn('test1@testmail.con', 'password'));
// })();

// import { Api } from './components/controller/api';
//
// const a = new Api();

// (async () => {
//   console.log(await a.getWords(0, 0));
// })();

// (async () => {
//   console.log(await a.createUser('TestUser11', 'test1testmail.con', 'password'));
// })();

// (async () => {
//   console.log(
//     await a.getUser(
//       '62f8c8a7c56bf40016a790ba',
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjhjOGE3YzU2YmY0MDAxNmE3OTBiYSIsImlhdCI6MTY2MDQ4NDYyOCwiZXhwIjoxNjYwNDk5MDI4fQ.vrUTHXocdU4xRfnIUObswcOruPcMN3ft-wIlzNV_oOw'
//     )
//   );
// })();

// (async () => {
//   console.log(
//     await a.updateUser(
//       '62f8c8a7c56bf40016a790ba',
//       'test1@testmail.con',
//       'password',
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjhjOGE3YzU2YmY0MDAxNmE3OTBiYSIsImlhdCI6MTY2MDQ4NzI2MSwiZXhwIjoxNjYwNTAxNjYxfQ.Yj5-PdIH0thQDK5vmbciJueMyUw3aUQMWGPU_pVuxoE'
//     )
//   );
// })();

// (async () => {
//   console.log(
//     await a.deleteUser(
//       '62f8c8a7c56bf40016a790ba',
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjhjOGE3YzU2YmY0MDAxNmE3OTBiYSIsImlhdCI6MTY2MDQ4NzI2MSwiZXhwIjoxNjYwNTAxNjYxfQ.Yj5-PdIH0thQDK5vmbciJueMyUw3aUQMWGPU_pVuxoE'
//     )
//   );
// })();

// (async () => {
//   console.log(
//     await a.getUserTokens(
//       '62f90aa40ebed300162e203d',
//       'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjkwYWE0MGViZWQzMDAxNjJlMjAzZCIsInRva2VuSWQiOiI0NWQ0YTI4ZC0xYzE5LTRmYzUtOTdhOC02NzMzNjMzNzhkNjgiLCJpYXQiOjE2NjA0OTEwMjUsImV4cCI6MTY2MDUwNzIyNX0.wRHxyWlT24vxjKavTWSuyZoW5hWCENv2wXHxeBGtQjE'
//     )
//   );
// })();

// (async () => {
//   console.log(
//     await a.getAllUserWords(
//       '62f90aa40ebed300162e203d',
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjkwYWE0MGViZWQzMDAxNjJlMjAzZCIsImlhdCI6MTY2MDU5MzczMCwiZXhwIjoxNjYwNjA4MTMwfQ.QTlg8NfxGryz6q5e_j_xxOervMNrL4QJKvihl7WnYHs'
//     )
//   );
// })();

// (async () => {
//   console.log(
//     await a.createUserWord(
//       '62f90aa40ebed300162e203d',
//       '5e9f5ee35eb9e72bc21af4a2',
//       'easy',
//       {},
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjkwYWE0MGViZWQzMDAxNjJlMjAzZCIsImlhdCI6MTY2MDQ5ODYzMywiZXhwIjoxNjYwNTEzMDMzfQ.pscFmjQm7BmfPQyiexkoxUSZHtY1yfb_VycAV8N9Mr4'
//     )
//   );
// })();

// (async () => {
//   console.log(
//     await a.getsUserWord(
//       '62f90aa40ebed300162e203d',
//       '5e9f5ee35eb9e72bc21af4a2',
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjkwYWE0MGViZWQzMDAxNjJlMjAzZCIsImlhdCI6MTY2MDUwOTAyOCwiZXhwIjoxNjYwNTIzNDI4fQ.pqKl4F8Lw_LBp5EqPZnW4eqo0o-QAgKk3Vwb2ghQLbk'
//     )
//   );
// })();

// (async () => {
//   console.log(
//     await a.updateUserWord(
//       '62f90aa40ebed300162e203d',
//       '5e9f5ee35eb9e72bc21af4a2',
//       'easy',
//       {},
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjkwYWE0MGViZWQzMDAxNjJlMjAzZCIsImlhdCI6MTY2MDUwOTg0NCwiZXhwIjoxNjYwNTI0MjQ0fQ.MWzkqCoapOoS_lGI1CylMOPnjNVRuwthOpv6dpOIP_I'
//     )
//   );
// })();

// (async () => {
//   console.log(
//     await a.deleteUserWord(
//       '62f90aa40ebed300162e203d',
//       '5e9f5ee35eb9e72bc21af4a2',
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjkwYWE0MGViZWQzMDAxNjJlMjAzZCIsImlhdCI6MTY2MDUxMDUyMSwiZXhwIjoxNjYwNTI0OTIxfQ.WL1IIo2beWLg9SI5suP-OI1XNawxbhhcNvLkZnksn-0'
//     )
//   );
// })();

// (async () => {
//   console.log(
//     await a.getUserAggregatedWord(
//       '62f90aa40ebed300162e203d',
//       '5e9f5ee35eb9e72bc21af4a2',
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjkwYWE0MGViZWQzMDAxNjJlMjAzZCIsImlhdCI6MTY2MDU1MjczNiwiZXhwIjoxNjYwNTY3MTM2fQ.pcBmdsG0TgD96w3sbX8ufFOaWJUQV086xWUsNjkqNPo'
//     )
//   );
// })();

// (async () => {
//   console.log(
//     await a.getStatistics(
//       '62f90aa40ebed300162e203d',
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjkwYWE0MGViZWQzMDAxNjJlMjAzZCIsImlhdCI6MTY2MDU2ODUyNiwiZXhwIjoxNjYwNTgyOTI2fQ.iU4wN9bni-9hRl2n0sTuHK9iUF7rZoYTwqiGIgZPvQA'
//     )
//   );
// })();

// (async () => {
//   console.log(
//     await a.upsertStatistics(
//       '62f90aa40ebed300162e203d',
//       101,
//       { qwe: 'asd' },
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjkwYWE0MGViZWQzMDAxNjJlMjAzZCIsImlhdCI6MTY2MDU2ODUyNiwiZXhwIjoxNjYwNTgyOTI2fQ.iU4wN9bni-9hRl2n0sTuHK9iUF7rZoYTwqiGIgZPvQA'
//     )
//   );
// })();

// (async () => {
//   console.log(
//     await a.getAllUserAggregatedWords(
//       '62f90aa40ebed300162e203d',
//       3,
//       3,
//       '',
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjkwYWE0MGViZWQzMDAxNjJlMjAzZCIsImlhdCI6MTY2MDU5MzczMCwiZXhwIjoxNjYwNjA4MTMwfQ.QTlg8NfxGryz6q5e_j_xxOervMNrL4QJKvihl7WnYHs'
//     )
//   );
// })();
