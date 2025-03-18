import { Service } from "@/types";

class AssetService implements Service {
  private assets: Record<string, HTMLImageElement> = {};

  public getAsset(name: string) {
    return this.assets[name];
  }

  public async loadAssets(assets: Record<string, string>) {
    for (const [name, path] of Object.entries(assets)) {
      if (this.assets[name]) {
        continue;
      }

      const asset = new Image();
      asset.src = path;
      this.assets[name] = asset;
      
      await new Promise((resolve) => {
        asset.onload = resolve;
      });
    }
  }
}

export default new AssetService();