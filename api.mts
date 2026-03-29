import { getStore } from '@netlify/blobs';

export default async (req: Request) => {
  const store = getStore('restaurante_state');

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    if (req.method === 'GET') {
      const state = await store.get('mesas', { type: 'json' }) || {};
      return new Response(JSON.stringify(state), { headers });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const state: any = (await store.get('mesas', { type: 'json' })) || {};

      const { mesa, tipo, origem, mensagem } = body;
      
      if (!mesa) {
         return new Response(JSON.stringify({ error: 'Mesa is required' }), { status: 400, headers });
      }

      if (origem === 'cliente') {
        state[mesa] = {
          status: 'waiting',
          pedido: tipo, // 'garcom' or 'conta'
          mensagem: '',
          timestamp: Date.now()
        };
      } else if (origem === 'painel') {
        if (!state[mesa]) {
          state[mesa] = {};
        }
        state[mesa].status = 'acknowledged';
        state[mesa].mensagem = mensagem || 'O garçom está a caminho!';
        state[mesa].timestamp = Date.now();
      } else if (origem === 'clear') {
        delete state[mesa];
      }

      await store.setJSON('mesas', state);
      return new Response(JSON.stringify({ success: true, state }), { headers });
    }

    return new Response('Method not allowed', { status: 405, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
};

export const config = {
  path: '/api/state'
};
