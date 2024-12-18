import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  private tokenBlacklist = new Set<string>();

  addToBlacklist(token: string) {
    this.tokenBlacklist.add(token);
  }

  isBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }
}