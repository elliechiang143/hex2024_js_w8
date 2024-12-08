const baseUrl = 'https://livejs-api.hexschool.io/'
const apiPath = "ellie2024";
const token = "hfJtHOPlbRhvrENYbBPc58tKa0D3";

const customerAPI = `${baseUrl}api/livejs/v1/customer/${apiPath}`

const adminAPI = `${baseUrl}api/livejs/v1/admin/${apiPath}`
const headers = {
  headers: {
    authorization: token,
  }
}