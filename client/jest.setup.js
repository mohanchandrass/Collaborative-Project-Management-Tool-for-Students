import "@testing-library/jest-dom"; // This provides matchers like toBeInTheDocument
import { TextDecoder, TextEncoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
