import { CapacitorConfig } from '@capacitor/cli';
import baseConfig from '../capacitor.config.base';
import fs from 'fs';
import path from 'path';

const isDevelopment = process.env.NODE_ENV === 'development';
const localUrl = process.env.CAPACITOR_LOCAL_URL || 'http://localhost:3000';

const developmentConfig = {
  server: {
    url: localUrl,
    cleartext: true,
    androidScheme: 'http',
  },
  android: {
    allowMixedContent: true,
  },
};

const config: CapacitorConfig = {
  ...(baseConfig as CapacitorConfig),
  ...(isDevelopment ? developmentConfig : {}),
};

// Write the config to capacitor.config.ts
const configPath = path.join(__dirname, '..', 'capacitor.config.ts');
const configContent = `import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = ${JSON.stringify(config, null, 2)};

export default config;
`;

fs.writeFileSync(configPath, configContent);

console.log(
  `Generated Capacitor config for ${isDevelopment ? 'development' : 'production'} environment`,
);
if (isDevelopment) {
  console.log(`Server URL: ${localUrl}`);
}
