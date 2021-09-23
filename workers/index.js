/**
 * Fetch event listener
 */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const corsHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Origin': '*',
}

/**
 * Respond with servers status
 * @param {Request} request
 */
async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response('OK', { headers: corsHeaders })
  }

  if (request.method === 'GET') {
    const text = (await SERVERS.get('data')) ?? await fetchServers()

    return new Response(text, {
      headers: {
        'content-type': 'application/json',
        ...corsHeaders,
      },
    })
  }
}

/**
 * Scheduled event listener
 */
addEventListener('scheduled', event => {
  event.waitUntil(handleSchedule(event.scheduledTime))
})

/**
 * Fetch servers status
 * @param {number} scheduledTime 
 */
async function handleSchedule(scheduledTime) {
  await fetchServers()
}

/**
 * Fetch servers status
 */
async function fetchServers() {
  const response = await fetch('https://doctorserver.tatlead.com/servers/servers.php')
  const data = await response.json()

  const text = JSON.stringify({
    updated: new Date(),
    servers: data.slice(1),
  })

  await SERVERS.put('data', text)

  return text
}
