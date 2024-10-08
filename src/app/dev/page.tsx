import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import "remixicon/fonts/remixicon.css";

export default function Home() {
  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ];

  return (
    <>
      <div className="mt-16 flex w-full justify-center">
        <div className="flex w-2/3 flex-col gap-4">
          <div>
            Installed components (see src/components/ui/README.md for component
            installation guide):
          </div>
          <div className="flex gap-4">
            <div>Button:</div>
            <Button variant="secondary">Click me</Button>
          </div>
          <div className="flex gap-4">
            <div>Accordion: </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                  {" "}
                  Yes. It comes with default styles that matches the other
                  components&apos; aesthetic
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>
                  Yes. It&apos;s animated by default, but you can disable it if
                  you prefer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="flex gap-4">
            <div>Checkbox:</div>
            <Checkbox />
          </div>
          <div className="flex gap-4">
            <div>Input:</div>
            <Input placeholder="Placeholder text..." />
          </div>
          <div className="flex gap-4">
            <div>Radio:</div>
            <RadioGroup defaultValue="a">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="a" id="r1" />
                <Label htmlFor="r1">Radio 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="b" id="r2" />
                <Label htmlFor="r2">Radio 2</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="c" id="r3" />
                <Label htmlFor="r3">Radio 3</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex gap-4">
            <div>Table:</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.invoice}>
                    <TableCell className="font-medium">
                      {invoice.invoice}
                    </TableCell>
                    <TableCell>{invoice.paymentStatus}</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      {invoice.totalAmount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <div className="flex gap-4">
            <div>Text Area:</div>
            <Textarea placeholder="Text area" />
          </div>
          <div className="flex gap-4">
            <div>(some) Icons: </div>
            <i className="ri-arrow-left-up-line"></i>
            <i className="ri-arrow-up-line"></i>
            <i className="ri-arrow-right-up-line"></i>
            <i className="ri-arrow-right-line"></i>
            <i className="ri-arrow-right-down-line"></i>
            <i className="ri-pencil-line"></i>
            <i className="ri-edit-circle-line"></i>
            <i className="ri-blur-off-line"></i>
          </div>
        </div>
      </div>
    </>
  );
}
