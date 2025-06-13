import request from 'supertest';
import { app } from './api-gateway';

describe('/v1/forge-authority API', () => {
  it('應能成功鍛造權限', async () => {
    const res = await request(app)
      .post('/v1/forge-authority')
      .send({ name: '測試權限', description: '單元測試用' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('測試權限');
  });

  it('應能查詢已鍛造權限', async () => {
    const forgeRes = await request(app)
      .post('/v1/forge-authority')
      .send({ name: '查詢權限', description: '查詢測試' });
    const id = forgeRes.body.id;
    const getRes = await request(app)
      .get(`/v1/forge-authority/${id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(id);
    expect(getRes.body.name).toBe('查詢權限');
  });

  it('應能移除權限', async () => {
    const forgeRes = await request(app)
      .post('/v1/forge-authority')
      .send({ name: '移除權限', description: '移除測試' });
    const id = forgeRes.body.id;
    const removeRes = await request(app)
      .delete(`/v1/forge-authority/${id}`);
    expect(removeRes.status).toBe(200);
    expect(removeRes.body.success).toBe(true);
  });

  it('查詢不存在權限應回傳 404', async () => {
    const res = await request(app)
      .get('/v1/forge-authority/non-existent-id');
    expect(res.status).toBe(404);
  });

  it('移除不存在權限應回傳 404', async () => {
    const res = await request(app)
      .delete('/v1/forge-authority/non-existent-id');
    expect(res.status).toBe(404);
  });
});
