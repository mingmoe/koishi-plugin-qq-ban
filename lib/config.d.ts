import { Schema } from 'koishi';
export interface Config {
    minAuthority: number;
    maxDuration: number;
}
export declare const Config: Schema<Config>;
