import { Config } from "@remotion/cli/config"

Config.setVideoImageFormat("jpeg")
Config.setOverwriteOutput(true)
Config.setEntryPoint("./src/remotion/index.ts")

// H.264 + AAC para compatibilidad con Instagram Reels.
Config.setCodec("h264")
Config.setPixelFormat("yuv420p")
