import Timer "mo:base/Timer";
import Random "mo:base/Random";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Blob "mo:base/Blob";
import Nat8 "mo:base/Nat8";

actor {
    // Stable storage for writings
    stable var writings : [(Text, Text)] = [];
    
    // Writing prompts
    let prompts : [Text] = [
        "Write about a mysterious door...",
        "Describe your perfect day...",
        "Create a story about time travel...",
        "Write about an unexpected friendship...",
        "Describe a magical garden...",
    ];

    // Timer duration in nanoseconds (5 minutes)
    let TIMER_DURATION = 300_000_000_000;
    
    // Store active timers
    private var activeTimers = Buffer.Buffer<Timer.TimerId>(1);

    // Get random prompt
    public func getRandomPrompt() : async Text {
        let seed = await Random.blob();
        let seedBytes = Blob.toArray(seed);
        if (seedBytes.size() == 0) {
            return prompts[0]; // fallback to first prompt if no random data
        };
        let randomByte = seedBytes[0];
        let index = Nat8.toNat(randomByte) % prompts.size();
        prompts[index]
    };

    // Start a writing timer
    public func startTimer() : async Timer.TimerId {
        let timerId = Timer.setTimer(#nanoseconds(TIMER_DURATION), func() : async () {
            Debug.print("Timer completed!");
        });
        activeTimers.add(timerId);
        timerId
    };

    // Cancel a timer
    public func cancelTimer(id : Timer.TimerId) : async () {
        Timer.cancelTimer(id);
        // Remove from active timers
        let newTimers = Buffer.Buffer<Timer.TimerId>(1);
        for (timerId in activeTimers.vals()) {
            if (timerId != id) {
                newTimers.add(timerId);
            };
        };
        activeTimers := newTimers;
    };

    // Save writing
    public func saveWriting(title : Text, content : Text) : async () {
        writings := Array.append(writings, [(title, content)]);
    };

    // Get all writings
    public query func getWritings() : async [(Text, Text)] {
        writings
    };

    // System functions for upgrade persistence
    system func preupgrade() {
        // Stable storage already handled
    };

    system func postupgrade() {
        // Cancel any existing timers after upgrade
        for (timerId in activeTimers.vals()) {
            Timer.cancelTimer(timerId);
        };
        activeTimers := Buffer.Buffer<Timer.TimerId>(1);
    };
}
