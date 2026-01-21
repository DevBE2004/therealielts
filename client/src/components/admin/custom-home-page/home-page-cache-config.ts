import { HomePageConfig } from "@/types/homepage";

let cachedConfig: HomePageConfig | null = null;
let loadingPromise: Promise<HomePageConfig> | null = null;

export async function getHomePageConfigCached(
  fetcher: () => Promise<HomePageConfig>
): Promise<HomePageConfig> {
  if (cachedConfig) return cachedConfig;

  if (!loadingPromise) {
    loadingPromise = fetcher().then((data) => {
      cachedConfig = data;
      return data;
    });
  }

  return loadingPromise;
}

export function updateHomePageConfigCache(
  updater: (prev: HomePageConfig) => HomePageConfig
) {
  if (!cachedConfig) {
    throw new Error("Config cache not initialized");
  }
  cachedConfig = updater(cachedConfig);
  return cachedConfig;
}

export function resetHomePageConfigCache() {
  cachedConfig = null;
  loadingPromise = null;
}
