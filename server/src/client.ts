import {
  ClientProxyFactory,
  Transport,
  ClientProxy,
} from '@nestjs/microservices';

async function testMicroservice() {
  // 创建一个 TCP 客户端
  const client: ClientProxy = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3000, // 确保与微服务使用的端口一致
    },
  });

  // 模拟调用微服务的 'hello' 命令
  const pattern = { cmd: 'hello' };
  const payload = {};

  client.send<string>(pattern, payload).subscribe({
    next: (response) => {
      console.log('Response from microservice:', response); // 应该输出 'Hello World!'
    },
    error: (err) => {
      console.error('Error:', err);
    },
    complete: () => {
      console.log('Request complete');
      client.close(); // 关闭客户端连接
    },
  });
}

testMicroservice();
