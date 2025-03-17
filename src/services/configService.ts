import { Service } from "@/types";

class ConfigService implements Service {
  private config: {
    width: number;
    height: number;
  } = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  public getConfig() {
    return this.config;
  }
}

export default new ConfigService();
