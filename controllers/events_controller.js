// DEPENDENCIES
const events = require('express').Router()
const db = require('../models')
const { Event, MeetGreet, SetTime, Stage, Band } = db 
const { Op } = require('sequelize')

// FIND ALL EVENTS
events.get('/', async (req, res) => {
    try {
        const foundEvents = await Event.findAll({
            where: {
                name: { [Op.like]: `%${req.query.name ? req.query.name : ''}%` }
            },
            include: [
                { model: Band, as: "band" },
                { model: Stage, as: "stage" }
            ],
            order: [['date', 'ASC']]
        })
        res.status(200).json(foundEvents)
    } catch (error) {
        res.status(500).json(error)
    }
})

// FIND A SPECIFIC EVENT
events.get('/:id', async (req, res) => {
    try {
        const foundEvent = await Event.findOne({
            where: { id: req.params.id },
            include: [
                { model: Band, as: "band" },
                { model: Stage, as: "stage" }
            ]
        })
        if (!foundEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(foundEvent)
    } catch (error) {
        res.status(500).json(error)
    }
})

// CREATE AN EVENT
events.post('/', async (req, res) => {
    const { name, date, time, bandId, stageId } = req.body;
    try {
        const newEvent = await Event.create({
            name,
            date,
            time,
            bandId,
            stageId,
        });
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE AN EVENT
events.put('/:id', async (req, res) => {
    const { name, date, time, bandId, stageId } = req.body;
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        event.name = name;
        event.date = date;
        event.time = time;
        event.bandId = bandId;
        event.stageId = stageId;
        await event.save();
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
})

// DELETE AN EVENT
events.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        await event.destroy();
        res.sendStatus(204);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
})

// EXPORT
module.exports = events
//on my config json file was not able to install after a while so i hand copied the code tha was provided