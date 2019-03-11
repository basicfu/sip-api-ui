/* eslint-disable max-len */
import request from './utils/request';

const prefix = '/api';
const base = '/base';
const sapi = '/sapi';

export async function allDict(params) { return request(`${prefix}${base}/dict/all`, { method: 'GET', body: params }); }

// 用户管理
export async function user() { return request(`${prefix}${base}/user`, { method: 'GET' }); }
export async function login(params) { return request(`${prefix}${base}/user/login`, { method: 'POST', body: params }); }
export async function logout() { return request(`${prefix}${base}/user/logout`, { method: 'GET' }); }
export async function listUser(params) { return request(`${prefix}${base}/user/list`, { method: 'GET', body: params }); }
export async function insertUser(params) { return request(`${prefix}${base}/user/insert`, { method: 'POST', body: params }); }
export async function updateUser(params) { return request(`${prefix}${base}/user/update`, { method: 'POST', body: params }); }
export async function deleteUser(params) { return request(`${prefix}${base}/user/delete`, { method: 'DELETE', body: params }); }
export async function suggestUser(params) { return request(`${prefix}${base}/user/suggest/${params.q}`, { method: 'GET' }); }

// 项目
export async function allProject(params) { return request(`${prefix}${sapi}/project/all`, { method: 'GET', body: params }); }
export async function insertProject(params) { return request(`${prefix}${sapi}/project/insert`, { method: 'POST', body: params }); }
export async function updateProject(params) { return request(`${prefix}${sapi}/project/update`, { method: 'POST', body: params }); }
export async function deleteProject(params) { return request(`${prefix}${sapi}/project/delete`, { method: 'DELETE', body: params }); }
// 项目分类
export async function getProjectCategory(params) { return request(`${prefix}${sapi}/project-category/get`, { method: 'GET', body: params }); }
export async function insertProjectCategory(params) { return request(`${prefix}${sapi}/project-category/insert`, { method: 'POST', body: params }); }
export async function updateProjectCategory(params) { return request(`${prefix}${sapi}/project-category/update`, { method: 'POST', body: params }); }
export async function deleteProjectCategory(params) { return request(`${prefix}${sapi}/project-category/delete`, { method: 'DELETE', body: params }); }
// 接口
export async function getInterface(params) { return request(`${prefix}${sapi}/interface/${params.id}`, { method: 'GET', body: params }); }
export async function listInterface(params) { return request(`${prefix}${sapi}/interface/list`, { method: 'GET', body: params }); }
export async function insertInterface(params) { return request(`${prefix}${sapi}/interface/insert`, { method: 'POST', body: params }); }
export async function updateInterface(params) { return request(`${prefix}${sapi}/interface/update`, { method: 'POST', body: params }); }
export async function deleteInterface(params) { return request(`${prefix}${sapi}/interface/delete`, { method: 'DELETE', body: params }); }
