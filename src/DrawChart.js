"use strict"
const fs = require('fs'),
    gm = require('gm'),
    moment = require('moment'),
    MovingAvg = require('./MovingAvg');

class DrawChart {
    constructor() {}
    draw(opt) {
        // input validation
        if (!opt)
            throw 'Requires a non-null parameter';
        if (!opt.DateTimeStart || typeof opt.DateTimeStart != 'number')
            throw 'DateTimeStart key must be an int';
        if (!opt.DateTimeEnd || typeof opt.DateTimeEnd != 'number')
            throw 'DateTimeEnd key must be an int';
        if (opt.DateTimeEnd < opt.DateTimeStart)
            throw 'DateTimeEnd cannot be less than DateTimeStart';
        if (!opt.DataPointIntervalSec)
            throw 'Missing DataPointIntervalSec key';


        let ImageHeight = 300,
            ImageWidth = 500,
            GraphTop = 50,
            GraphBottom = 50,
            GraphLeft = 50,
            GraphRight = 20;
        let image = gm(ImageWidth, ImageHeight, '#ddff99');
        image.stroke('#d9d9d9');
        // horizontal lines
        for (var i = GraphTop; i < ImageHeight - GraphBottom; i += 10) {
            image.drawLine(GraphLeft, i, ImageWidth - GraphRight, i);
        }

        // vertical lines
        for (var i = GraphLeft; i < ImageWidth - GraphRight; i += 10) {
            image.drawLine(i, GraphTop, i, ImageHeight - GraphBottom);
        }

        // x-axis
        image.stroke('#a0a0a0');
        image.drawLine(GraphLeft, ImageHeight - GraphBottom, ImageWidth - GraphRight, ImageHeight - GraphBottom);
        let TextWidth = 10 * opt.XAxisName.length;
        image.drawText(ImageWidth - GraphRight - TextWidth, ImageHeight - GraphBottom + 30, opt.XAxisName);
        // y-axis
        image.drawLine(GraphLeft, GraphTop, GraphLeft, ImageHeight - GraphBottom);
        image.drawText(GraphLeft, GraphTop - 5, opt.YAxisName);

        image.stroke('#000', 1);
        image.drawText(GraphLeft, 20, opt.title);

        // sort data into ascending order
        opt.data = opt.data.sort((a, b) => {
            if (a.DateTimeCreated > b.DateTimeCreated)
                return 1;
            if (a.DateTimeCreated < b.DateTimeCreated)
                return -1;
            return 0;
        });

        let ChartData = this.getChartData(opt);
        console.log('Max: %s, Min: %s', ChartData.MaxValue, ChartData.MinValue);
        // draw the data line
        let GraphWidth = ImageWidth - GraphLeft - GraphRight,
            DataPointIntervalX = GraphWidth / ChartData.data.length,
            GraphHeight = ImageHeight - GraphTop - GraphBottom,
            DataPointIntervalY = GraphHeight / (ChartData.MaxValue),
            LastPointX = null,
            LastPointY = null;
        ChartData.data.forEach((item, index) => {
            let ThisPointX = null,
                ThisPointY = null;
            if (item.value > 0)
                console.log('DateTimeStart: %s, value: %s', item.DateTimeStart, item.value);

            if (item.value === null) {
                if (LastPointX === null) {
                    // do nothing
                } else {
                    // follow last point
                    ThisPointX = parseInt(LastPointX + DataPointIntervalX);
                    ThisPointY = LastPointY;
                }
            } else {
                // calc graph point
                console.log('BaseHeight: %s, substracted height: %s', (GraphTop + GraphHeight), (item.value * DataPointIntervalY))
                ThisPointY = parseInt(GraphTop + GraphHeight - item.value * DataPointIntervalY);
                ThisPointX = parseInt(GraphLeft + index * DataPointIntervalX);
            }

            if (ThisPointX != null && LastPointX != null) {
                console.log('From %s, %s to %s, %s (%s)', LastPointX, LastPointY, ThisPointX, ThisPointY, DataPointIntervalX);
                image.drawLine(LastPointX, LastPointY, ThisPointX, ThisPointY);
            }

            LastPointX = ThisPointX;
            LastPointY = ThisPointY;
        });



        // write to disk
        image.write('image.jpg', (err) => {
            console.log(err);
        });
    }
    getChartData(opt) {
        // iterate data points
        let DataPointStart = opt.DateTimeStart,
            AvgCalc = new MovingAvg(),
            result = {
                MaxValue: null,
                MinValue: null,
                data: []
            };
        console.log('Input: %s, %s, %i', opt.DateTimeStart, opt.DateTimeEnd, (opt.DateTimeEnd - opt.DateTimeStart));
        while (DataPointStart <= opt.DateTimeEnd) {
            let DataPointEnd = (DataPointStart + opt.DataPointIntervalSec > opt.DateTimeEnd) ?
                // partial slot calc
                DataPointStart + (opt.DateTimeEnd - DataPointStart) - 1 :
                // full slot calc
                DataPointStart + opt.DataPointIntervalSec - 1;

            AvgCalc.reset();
            // iterate through raw data
            while (opt.data.length > 0 &&
                DataPointStart <= opt.data[0].DateTimeCreated &&
                DataPointEnd >= opt.data[0].DateTimeCreated) {
                AvgCalc.addSample(opt.data[0].value);
                // remove from array
                console.log('Added sample value: %s', opt.data[0].value);
                opt.data.shift();
            }
            let DataPoint = {
                DateTimeStart: DataPointStart,
                DateTimeEnd: DataPointEnd,
                value: AvgCalc.getSampleCount() === 0 ? null : AvgCalc.result(),
                SampleCount: AvgCalc.getSampleCount()
            };
            // add to result array
            result.data.push(DataPoint);

            // update max/ min calc
            if (DataPoint.SampleCount > 0) {
                if (result.MaxValue === null || DataPoint.value > result.MaxValue)
                    result.MaxValue = DataPoint.value;
                if (result.MinValue === null || DataPoint.value < result.MinValue)
                    result.MinValue = DataPoint.value;
            }

            // prepare next iteration
            DataPointStart += opt.DataPointIntervalSec;
        }

        return result;
    }
}

module.exports = DrawChart;