#!/bin/python3

# Apply an affine transformation to the timestamps in a VTT file.

# $ vtt_shift.py my_vtt_file.vtt transformed.vtt --shift=-4 --scale=0.96

import argparse
import os
import re

parser = argparse.ArgumentParser(description="VTT time shifter")

parser.add_argument("vtt_file", help="Path to vtt to timeshift")
parser.add_argument("out_file", help="Output path")
parser.add_argument(
    "--shift", help="How many seconds to shift the timestamps by", type=float, default=0
)
parser.add_argument(
    "--scale",
    help="How many seconds to scale the timestamps by post any shift",
    type=float,
    default=1,
)
parser.add_argument(
    "-o", "--overwrite", help="Allow overwriting the output file", action="store_true"
)

args = parser.parse_args()

vtt_file = args.vtt_file
out_file = args.out_file

if not os.path.exists(vtt_file):
    print("Couldn't find the requested vtt file:", vtt_file)
    exit()

if os.path.exists(out_file) and not args.overwrite:
    print("Can't overwrite existing file:", out_file)
    exit()


timestamp_pattern = r"^(\d*?):?(\d+):(\d+\.?\d+)$"
timestamp_matcher = re.compile(timestamp_pattern)


def timestamp_to_float_seconds(s: str):
    match = timestamp_matcher.match(s)
    if not match:
        raise ValueError(f"Failed to match timestamp {repr(s)} to the timestamp regex.")
    hours, minutes, seconds = match.groups("0")
    if hours == "":
        hours = "0"
    hours, minutes, seconds = int(hours), int(minutes), float(seconds)
    return hours * 3600 + minutes * 60 + seconds


def float_seconds_to_timestamp(t: float) -> str:
    s = t % 60
    m = int((t // 60) % 60)
    h = int(t // 3600)
    ts = ""
    if h > 0:
        ts += f"{h:02d}:"
    ts += f"{m:02d}:{s:.3f}"
    return ts


shifted_vtt = ""
timestamp_line_re = r"^(\d*:?\d+:\d+.\d+) --> (\d*:?\d+:\d+.\d+)$"
timestamp_line_matcher = re.compile(timestamp_line_re)
with open(vtt_file, "r") as vtt_data:
    for l in vtt_data:
        m = timestamp_line_matcher.match(l)
        if m:
            ts_0, ts_1 = m.groups()
            t_0 = timestamp_to_float_seconds(ts_0)
            t_1 = timestamp_to_float_seconds(ts_1)
            nt_0 = (t_0 + args.shift) * args.scale
            nt_1 = (t_1 + args.shift) * args.scale
            nts_0 = float_seconds_to_timestamp(nt_0)
            nts_1 = float_seconds_to_timestamp(nt_1)
            shifted_vtt += f"{nts_0} --> {nts_1}\n"
        else:
            shifted_vtt += l

with open(out_file, "w") as f:
    f.write(shifted_vtt)
