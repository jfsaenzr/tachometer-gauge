let dispatch = d3.dispatch('redraw');

let data = [
    { 'nombre': 'Indicador A', 'medida': 98 },
    { 'nombre': 'Indicador B', 'medida': 45 },
    { 'nombre': 'Indicador C', 'medida': 60 },
    { 'nombre': 'Indicador D', 'medida': 8 },
    { 'nombre': 'Indicador E', 'medida': 98 },
    { 'nombre': 'Indicador F', 'medida': 73 },
    { 'nombre': 'Indicador G', 'medida': 50 },
    { 'nombre': 'Indicador H', 'medida': 12 },
    { 'nombre': 'Indicador I', 'medida': 85 },
    { 'nombre': 'Indicador J', 'medida': 18 },
]

let xf = crossfilter(data);

//Dimensiones 
let horasCausadasDim = xf.dimension(function (d) { return d.nombre });
//Grupos 
let horasCausadasDimSumGroup = horasCausadasDim.group().reduceSum(function (d) { return +d.medida; });
//Instancia
let gauges = tachometerChart("#tachometer");

//Graficos
gauges
    .dispatch(dispatch)
    .group(horasCausadasDimSumGroup)

//Pintar
gauges
    .render();

dispatch.call("redraw");











