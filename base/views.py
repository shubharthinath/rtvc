from django.shortcuts import render
from decouple import config
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder
import random
import time


def getToken(request):
    appId = 'a24681963b024ac8b77ea8739f5f1dcf'
    appCertificate = config('appCertificate')
    channelName = request.GET.get('channel')
    uid = random.randint(1, 230)
    expirationTimeInSeconds = 3600 * 24
    currentTimestamp = int(time.time())
    privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
    role = 1

    token = RtcTokenBuilder.buildTokenWithUid(
        appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({'token': token, 'uid': uid}, safe=False)


def lobby(request):
    return render(request, 'base/lobby.html')


def room(request):
    return render(request, 'base/room.html')
