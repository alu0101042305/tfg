const contaminantes = []

function addCont(name, id, range) {
    contaminantes.push({
        name: name,
        id: id,
        range: range
    })
}

addCont('SO\u2082', 1, [100, 200, 350, 500, 1250])
addCont('NO\u2082', 8, [40, 100, 200, 400, 1000])
addCont('PM2,5', 9, [10, 20, 25, 50, 800])
addCont('PM10', 10, [20, 53, 50, 100, 1200])
addCont('O\u2083', 14, [80, 120, 180, 240, 600])

contaminantes.default = contaminantes[Math.floor(contaminantes.length / 2)]

export default contaminantes;