// jwt-payload.interface.ts
export interface JwtPayload {
  username: string;
  sub: number; // 用户的唯一标识符，例如用户 ID
  // 可以根据需要添加其他字段，例如角色、权限等
}
