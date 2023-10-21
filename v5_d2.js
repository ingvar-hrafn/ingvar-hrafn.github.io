function mouseLook(key, mdelta) {

    // Sensitivity músar
    const sensitivity = 0.005;
    // Hraði áhorfenda (w a s d)
    const speed = 0.1;

    // Upphafsstilla UAngle(áttina) ef ekki er búið að gera það
    if (typeof UAngle === 'undefined') {
        UAngle = 0;
    }

    // Nýtt stefnuhorn út frá mdelta
    UAngle += mdelta * sensitivity;

    // Athuga hvort ýtt var á w a s eða d og uppfært stöðu áhorfandans
    let dx = 0;
    let dy = 0;

    if (key === 'w') {
        dy = -speed;
    } else if (key === 's') {
        dy = speed;
    } else if (key === 'a') {
        dx = -speed;
    } else if (key === 'd') {
        dx = speed;
    }

    // Uppfæra UAngle ef áhorfandi færðist
    UAngle += dx;

    // Sjónarhornið út frá núverandi stefnu
    const viewVector = [Math.cos(UAngle), 0, Math.sin(UAngle)];

    // perpendicular vector
    const rightVector = cross([0, 1, 0], viewVector);

    // Nýr up vector
    const upVector = cross(viewVector, rightVector);

    // Sett er inn hér fyrir currentPositionX, currentPositionY og currentPositionZ með núverandi staðsetningarhnitum áhorfandans
    const eye = [currentPositionX, currentPositionY, currentPositionZ];
    const at = [
        eye[0] + viewVector[0],
        eye[1] + viewVector[1],
        eye[2] + viewVector[2],
    ];
    const up = upVector;

    // Búið er til view matrx
    const result = lookAt(eye, at, up);

    return result;
}
