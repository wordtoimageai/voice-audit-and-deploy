import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    project: 'STARTBD_COMMANDER_V1',
    commander: 'StartBD AI Voice Assistant',
    owner: 'Tawhid',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      voice: 'active',
      llm_router: 'active',
      domain_api: 'standby',
      social_api: 'standby',
    },
  })
}
