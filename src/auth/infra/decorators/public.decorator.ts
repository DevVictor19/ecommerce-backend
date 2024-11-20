import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'is-public';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
