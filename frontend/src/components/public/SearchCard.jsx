import { useState } from "react";
import { format } from "date-fns";

import {
    CalendarDays,
    Building2,
    Users,
    Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const SearchCard = () => {
    const [date, setDate] = useState();
    const [property, setProperty] = useState("");
    const [guests, setGuests] = useState("1");

    const handleSearch = () => {
        console.log({
            date,
            property,
            guests,
        });
    };

    return (
        <div className="mt-12 overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.4fr_1.2fr_1.3fr]">

                {/* Stay */}

                <div className="flex h-24 items-center border-b px-7 lg:border-b-0 lg:border-r">

                    <CalendarDays className="mr-4 h-6 w-6 text-blue-600" />

                    <div className="flex flex-col">

                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Stay
                        </span>

                        <Popover>

                            <PopoverTrigger asChild>

                                <button className="mt-1 text-left text-lg font-semibold text-gray-900 hover:text-blue-600">

                                    {date?.from
                                        ? date.to
                                            ? `${format(date.from, "dd MMM")} - ${format(
                                                date.to,
                                                "dd MMM"
                                            )}`
                                            : format(date.from, "dd MMM")
                                        : "Select Dates"}

                                </button>

                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0">

                                <Calendar
                                    mode="range"
                                    numberOfMonths={2}
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={{ before: new Date() }}
                                    initialFocus
                                />

                            </PopoverContent>

                        </Popover>

                    </div>

                </div>

                {/* Property */}

                <div className="flex h-24 items-center border-b px-7 lg:border-b-0 lg:border-r">

                    <Building2 className="mr-4 h-6 w-6 text-blue-600" />

                    <div className="flex-1">

                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Property
                        </span>

                        <Select value={property} onValueChange={setProperty}>

                            <SelectTrigger className="mt-1 h-auto border-0 p-0 shadow-none">

                                <SelectValue
                                    placeholder="Select Property"
                                    className="text-lg"
                                />

                            </SelectTrigger>

                            <SelectContent>

                                <SelectItem value="seskines">
                                    Seskines
                                </SelectItem>

                                <SelectItem value="latgaliu">
                                    Latgaliu
                                </SelectItem>

                                <SelectItem value="pylimo">
                                    Pylimo
                                </SelectItem>

                            </SelectContent>

                        </Select>

                    </div>

                </div>

                {/* Guests */}

                <div className="flex h-24 items-center border-b px-7 lg:border-b-0 lg:border-r">

                    <Users className="mr-4 h-6 w-6 text-blue-600" />

                    <div className="flex-1">

                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Guests
                        </span>

                        <Select value={guests} onValueChange={setGuests}>

                            <SelectTrigger className="mt-1 h-auto border-0 p-0 shadow-none">

                                <SelectValue />

                            </SelectTrigger>

                            <SelectContent>

                                <SelectItem value="1">1 Guest</SelectItem>
                                <SelectItem value="2">2 Guests</SelectItem>
                                <SelectItem value="3">3 Guests</SelectItem>
                                <SelectItem value="4">4 Guests</SelectItem>
                                <SelectItem value="5">5 Guests</SelectItem>

                            </SelectContent>

                        </Select>

                    </div>

                </div>

                {/* Search */}

                <div className="flex items-center justify-center p-5">

                    <Button
                        onClick={handleSearch}
                        className="h-14 w-full rounded-xl text-base font-semibold"
                    >
                        <Search className="mr-2 h-5 w-5" />
                        Search Rooms
                    </Button>

                </div>

            </div>

        </div>
    );
};

export default SearchCard;