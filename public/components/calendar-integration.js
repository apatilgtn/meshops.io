// Calendar Integration with multiple providers
class CalendarIntegration {
    constructor() {
        this.providers = {
            google: new GoogleCalendarProvider(),
            outlook: new OutlookCalendarProvider(),
            ical: new ICalProvider()
        };
        this.currentProvider = null;
    }

    async initialize(providerName = 'google') {
        try {
            this.currentProvider = this.providers[providerName];
            await this.currentProvider.initialize();
            return true;
        } catch (error) {
            console.error('Calendar initialization failed:', error);
            return false;
        }
    }

    async getAvailableSlots(startDate, endDate) {
        try {
            const busySlots = await this.currentProvider.getBusySlots(startDate, endDate);
            return this.generateAvailableSlots(startDate, endDate, busySlots);
        } catch (error) {
            console.error('Failed to get available slots:', error);
            throw error;
        }
    }

    generateAvailableSlots(startDate, endDate, busySlots) {
        const slots = [];
        const workingHours = {
            start: 9, // 9 AM
            end: 17   // 5 PM
        };

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
                for (let hour = workingHours.start; hour < workingHours.end; hour++) {
                    const slotStart = new Date(date);
                    slotStart.setHours(hour, 0, 0, 0);
                    
                    if (!this.isSlotBusy(slotStart, busySlots)) {
                        slots.push({
                            start: slotStart,
                            end: new Date(slotStart.getTime() + 60 * 60 * 1000), // 1 hour slots
                            available: true
                        });
                    }
                }
            }
        }
        return slots;
    }

    isSlotBusy(slot, busySlots) {
        return busySlots.some(busy => 
            slot >= busy.start && slot < busy.end
        );
    }

    async createEvent(details) {
        try {
            return await this.currentProvider.createEvent(details);
        } catch (error) {
            console.error('Failed to create calendar event:', error);
            throw error;
        }
    }
}

// Google Calendar Provider
class GoogleCalendarProvider {
    async initialize() {
        // Simulated for demo purposes
        console.log('Google Calendar initialized');
        return true;
    }

    async getBusySlots(startDate, endDate) {
        // Simulated busy slots
        return [];
    }

    async createEvent(details) {
        // Simulated event creation
        console.log('Creating Google Calendar event:', details);
        return {
            id: 'event-' + Math.random(),
            link: 'https://calendar.google.com'
        };
    }
}

// Outlook Calendar Provider
class OutlookCalendarProvider {
    async initialize() {
        console.log('Outlook Calendar initialized');
        return true;
    }

    async getBusySlots(startDate, endDate) {
        return [];
    }

    async createEvent(details) {
        return {
            id: 'outlook-' + Math.random(),
            link: 'https://outlook.office.com'
        };
    }
}

// iCal Provider
class ICalProvider {
    async initialize() {
        console.log('iCal initialized');
        return true;
    }

    async getBusySlots(startDate, endDate) {
        return [];
    }

    async createEvent(details) {
        return {
            id: 'ical-' + Math.random(),
            link: 'calendar.ics'
        };
    }
}